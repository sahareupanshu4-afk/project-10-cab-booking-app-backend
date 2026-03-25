-- Cab Booking App Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('RIDER', 'DRIVER', 'ADMIN');
CREATE TYPE ride_status AS ENUM ('REQUESTED', 'ACCEPTED', 'DRIVER_ARRIVING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE promo_type AS ENUM ('PERCENTAGE', 'FLAT');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE vehicle_type AS ENUM ('ECONOMY', 'PREMIUM', 'XL');

-- ============================================
-- TABLES
-- ============================================

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'RIDER',
    name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    total_rides INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Drivers Table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    vehicle_type vehicle_type NOT NULL DEFAULT 'ECONOMY',
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_color VARCHAR(50),
    is_available BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    last_location_update TIMESTAMP WITH TIME ZONE,
    total_earnings DECIMAL(10, 2) DEFAULT 0.00,
    total_trips INTEGER DEFAULT 0,
    documents JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Contacts Table
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promo Codes Table
CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    type promo_type NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    min_amount DECIMAL(10, 2) DEFAULT 0.00,
    max_discount DECIMAL(10, 2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rides Table
CREATE TABLE rides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID REFERENCES users(id) ON DELETE SET NULL NOT NULL,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    
    -- Pickup Details
    pickup_address TEXT NOT NULL,
    pickup_lat DECIMAL(10, 8) NOT NULL,
    pickup_lng DECIMAL(11, 8) NOT NULL,
    
    -- Drop Details
    drop_address TEXT NOT NULL,
    drop_lat DECIMAL(10, 8) NOT NULL,
    drop_lng DECIMAL(11, 8) NOT NULL,
    
    -- Multi-stop support
    stops JSONB DEFAULT '[]'::jsonb,
    
    -- Ride Details
    vehicle_type vehicle_type NOT NULL DEFAULT 'ECONOMY',
    distance DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- in kilometers
    duration INTEGER NOT NULL DEFAULT 0, -- in seconds
    base_fare DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    surge_multiplier DECIMAL(3, 2) DEFAULT 1.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    promo_code_id UUID REFERENCES promo_codes(id) ON DELETE SET NULL,
    final_fare DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    
    -- Status
    status ride_status NOT NULL DEFAULT 'REQUESTED',
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES users(id) ON DELETE SET NULL,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    driver_arrived_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL NOT NULL,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    
    -- Stripe Details
    stripe_payment_intent VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    
    -- Amount Details
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    platform_fee DECIMAL(10, 2) DEFAULT 0.00,
    driver_earnings DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Status
    status payment_status NOT NULL DEFAULT 'PENDING',
    
    -- Refund Details
    refund_amount DECIMAL(10, 2),
    refund_reason TEXT,
    refunded_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
    rider_id UUID REFERENCES users(id) ON DELETE SET NULL NOT NULL,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Tickets Table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL NOT NULL,
    ride_id UUID REFERENCES rides(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ticket_status NOT NULL DEFAULT 'OPEN',
    priority VARCHAR(20) DEFAULT 'NORMAL',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    responses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Emergency Logs Table
CREATE TABLE emergency_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    alert_type VARCHAR(50) DEFAULT 'SOS',
    message TEXT,
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Payment Methods Table
CREATE TABLE user_payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    stripe_payment_method_id VARCHAR(255) NOT NULL,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver Location History (for analytics)
CREATE TABLE driver_location_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2),
    heading DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ride Tracking Table (real-time updates)
CREATE TABLE ride_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    eta_seconds INTEGER,
    distance_remaining DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_drivers_available ON drivers(is_available);
CREATE INDEX idx_drivers_location ON drivers(current_lat, current_lng);
CREATE INDEX idx_rides_rider_id ON rides(rider_id);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_created_at ON rides(created_at DESC);
CREATE INDEX idx_payments_ride_id ON payments(ride_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_reviews_driver_id ON reviews(driver_id);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_emergency_logs_ride_id ON emergency_logs(ride_id);
CREATE INDEX idx_driver_location_history_driver_id ON driver_location_history(driver_id);
CREATE INDEX idx_ride_tracking_ride_id ON ride_tracking(ride_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_location_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_tracking ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users Policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid()::text = id::text OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'ADMIN'
    ));

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'ADMIN'
    ));

CREATE POLICY "Admins can update all users"
    ON users FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'ADMIN'
    ));

-- Drivers Policies
CREATE POLICY "Drivers can view their own data"
    ON drivers FOR SELECT
    USING (user_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'ADMIN'
    ));

CREATE POLICY "Drivers can update their own data"
    ON drivers FOR UPDATE
    USING (user_id = auth.uid()::uuid);

CREATE POLICY "Riders can view available drivers"
    ON drivers FOR SELECT
    USING (is_available = true);

-- Rides Policies
CREATE POLICY "Users can view their own rides"
    ON rides FOR SELECT
    USING (
        rider_id = auth.uid()::uuid 
        OR driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()::uuid)
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'ADMIN')
    );

CREATE POLICY "Riders can create rides"
    ON rides FOR INSERT
    WITH CHECK (rider_id = auth.uid()::uuid);

CREATE POLICY "Drivers can update assigned rides"
    ON rides FOR UPDATE
    USING (
        driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()::uuid)
        OR rider_id = auth.uid()::uuid
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'ADMIN')
    );

-- Payments Policies
CREATE POLICY "Users can view their own payments"
    ON payments FOR SELECT
    USING (
        user_id = auth.uid()::uuid 
        OR driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()::uuid)
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'ADMIN')
    );

-- Reviews Policies
CREATE POLICY "Users can view reviews for their rides"
    ON reviews FOR SELECT
    USING (
        rider_id = auth.uid()::uuid 
        OR driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()::uuid)
    );

CREATE POLICY "Riders can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (rider_id = auth.uid()::uuid);

-- Emergency Contacts Policies
CREATE POLICY "Users can manage their emergency contacts"
    ON emergency_contacts FOR ALL
    USING (user_id = auth.uid()::uuid);

-- Support Tickets Policies
CREATE POLICY "Users can view their own tickets"
    ON support_tickets FOR SELECT
    USING (
        user_id = auth.uid()::uuid 
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'ADMIN')
    );

CREATE POLICY "Users can create tickets"
    ON support_tickets FOR INSERT
    WITH CHECK (user_id = auth.uid()::uuid);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid()::uuid);

-- Emergency Logs Policies
CREATE POLICY "Users can view emergency logs for their rides"
    ON emergency_logs FOR SELECT
    USING (
        user_id = auth.uid()::uuid 
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'ADMIN')
    );

CREATE POLICY "Users can create emergency logs"
    ON emergency_logs FOR INSERT
    WITH CHECK (user_id = auth.uid()::uuid);

-- User Payment Methods Policies
CREATE POLICY "Users can manage their payment methods"
    ON user_payment_methods FOR ALL
    USING (user_id = auth.uid()::uuid);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update timestamp trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update driver rating after review
CREATE OR REPLACE FUNCTION update_driver_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(3, 2);
BEGIN
    SELECT AVG(rating)::DECIMAL(3, 2) INTO avg_rating
    FROM reviews
    WHERE driver_id = NEW.driver_id;
    
    UPDATE drivers
    SET total_trips = total_trips + 1
    WHERE id = NEW.driver_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_driver_rating_after_review
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_driver_rating();

-- Function to update user total rides
CREATE OR REPLACE FUNCTION update_user_total_rides()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED' THEN
        UPDATE users SET total_rides = total_rides + 1 WHERE id = NEW.rider_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_rides_after_completion
    AFTER UPDATE ON rides
    FOR EACH ROW EXECUTE FUNCTION update_user_total_rides();

-- Function to update driver earnings
CREATE OR REPLACE FUNCTION update_driver_earnings()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'COMPLETED' THEN
        UPDATE drivers 
        SET total_earnings = total_earnings + (
            SELECT driver_earnings FROM payments WHERE ride_id = NEW.id
        )
        WHERE id = NEW.driver_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_driver_earnings_after_payment
    AFTER UPDATE ON payments
    FOR EACH ROW 
    WHEN (NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED')
    EXECUTE FUNCTION update_driver_earnings();

-- Function to increment promo code usage
CREATE OR REPLACE FUNCTION increment_promo_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.promo_code_id IS NOT NULL THEN
        UPDATE promo_codes 
        SET used_count = used_count + 1 
        WHERE id = NEW.promo_code_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_promo_code_usage
    AFTER INSERT ON rides
    FOR EACH ROW EXECUTE FUNCTION increment_promo_usage();

-- ============================================
-- VIEWS
-- ============================================

-- View for active rides with details
CREATE VIEW active_rides AS
SELECT 
    r.id,
    r.rider_id,
    u_rider.name as rider_name,
    u_rider.phone as rider_phone,
    r.driver_id,
    d.vehicle_type,
    d.vehicle_number,
    u_driver.name as driver_name,
    r.pickup_address,
    r.drop_address,
    r.status,
    r.final_fare,
    r.requested_at
FROM rides r
LEFT JOIN users u_rider ON r.rider_id = u_rider.id
LEFT JOIN drivers d ON r.driver_id = d.id
LEFT JOIN users u_driver ON d.user_id = u_driver.id
WHERE r.status NOT IN ('COMPLETED', 'CANCELLED');

-- View for driver earnings summary
CREATE VIEW driver_earnings_summary AS
SELECT 
    d.id as driver_id,
    d.user_id,
    u.name as driver_name,
    d.total_earnings,
    d.total_trips,
    COUNT(r.id) as total_rides,
    AVG(rv.rating) as avg_rating
FROM drivers d
LEFT JOIN users u ON d.user_id = u.id
LEFT JOIN rides r ON d.id = r.driver_id AND r.status = 'COMPLETED'
LEFT JOIN reviews rv ON d.id = rv.driver_id
GROUP BY d.id, d.user_id, u.name, d.total_earnings, d.total_trips;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert sample promo codes
INSERT INTO promo_codes (code, description, type, value, min_amount, max_discount, usage_limit, expires_at) VALUES
('FIRST50', '50% off on your first ride', 'PERCENTAGE', 50.00, 100.00, 200.00, 1, NOW() + INTERVAL '1 year'),
('FLAT100', 'Flat $10 off', 'FLAT', 10.00, 50.00, NULL, 100, NOW() + INTERVAL '6 months'),
('WEEKEND20', '20% off on weekends', 'PERCENTAGE', 20.00, 0.00, 50.00, NULL, NOW() + INTERVAL '3 months');

-- ============================================
-- REALTIME PUBLICATION
-- ============================================

-- Enable realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE rides;
ALTER PUBLICATION supabase_realtime ADD TABLE ride_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE drivers;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE emergency_logs;