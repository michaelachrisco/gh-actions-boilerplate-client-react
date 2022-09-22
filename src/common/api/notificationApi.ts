import { createApi } from '@reduxjs/toolkit/query/react';
import { PaginatedResult } from 'common/models';
import { AppNotification } from 'common/models/notifications';
import { customBaseQuery } from './customBaseQuery';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: customBaseQuery,

  endpoints: builder => ({
    getUnreadNotifications: builder.query<PaginatedResult<AppNotification>, string | null>({
      query: q => q || '/notifications/?read__isnull=true',
    }),

    getReadNotifications: builder.query<PaginatedResult<AppNotification>, string | null>({
      query: q => q || '/notifications/?read__isnull=false',
    }),

    markAllRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/mark_all_read/',
        method: 'POST',
      }),
    }),
  }),
});

export const { useGetUnreadNotificationsQuery, useMarkAllReadMutation, useGetReadNotificationsQuery } = notificationApi;
