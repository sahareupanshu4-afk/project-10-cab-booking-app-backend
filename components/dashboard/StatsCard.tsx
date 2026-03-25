'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary-600',
  iconBgColor = 'bg-primary-100',
  trend,
  className = '',
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${className}`}>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-sm font-medium ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </span>
                  <span className="text-xs text-gray-500">vs last week</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}