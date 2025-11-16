'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Eye, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AdminRepairRowProps {
  repair: any
  statusConfig: any
  urgencyConfig: any
  userName: string
}

export default function AdminRepairRow({ repair, statusConfig, urgencyConfig, userName }: AdminRepairRowProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const response = await fetch(`/api/repairs/${repair.id}/messages/unread`)
        const data = await response.json()
        if (response.ok) {
          setUnreadCount(data.unreadCount || 0)
        }
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }

    fetchUnread()

    const channel = supabase
      .channel(`repair_messages_unread_admin:${repair.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'repair_messages',
          filter: `repair_request_id=eq.${repair.id}`,
        },
        () => {
          fetchUnread()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [repair.id])

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">
              #{repair.id.substring(0, 8).toUpperCase()}
            </div>
            <div className="text-sm text-gray-500">
              S/N: {repair.serial_number || 'Brak'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="font-medium text-gray-900">{repair.device_model}</div>
          <div className="text-gray-500 line-clamp-1">
            {repair.issue_description.substring(0, 50)}...
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="font-medium text-gray-900">{userName}</div>
          <div className="text-gray-500">{repair.user_email}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {urgencyConfig ? (
          <span className={`text-sm font-medium ${urgencyConfig.color}`}>
            {urgencyConfig.label}
          </span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(repair.created_at), 'dd MMM yyyy', { locale: pl })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          {unreadCount > 0 && (
            <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              <MessageCircle className="w-3 h-3" />
              {unreadCount}
            </div>
          )}
          <Link
            href={`/admin/zgloszenie/${repair.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Szczegóły
          </Link>
        </div>
      </td>
    </tr>
  )
}
