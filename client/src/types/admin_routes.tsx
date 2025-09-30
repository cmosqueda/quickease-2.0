/* eslint-disable @typescript-eslint/no-explicit-any */

import AdminManageCommentPage from "@/routes/(admin)/(comment)/AdminManageComment";
import AdminManageCommentReportsPage from "@/routes/(admin)/(dashboard)/AdminManageCommentReports";
import AdminManagePostReportsPage from "@/routes/(admin)/(dashboard)/AdminManagePostReports";
import AdminManageUsersPage from "@/routes/(admin)/(dashboard)/AdminManageUsers";
import AdminManagePostPage from "@/routes/(admin)/(post)/AdminManagePost";
import AdminSearchReportsPage from "@/routes/(admin)/(search)/AdminSearchPosts";
import AdminSearchUsersPage from "@/routes/(admin)/(search)/AdminSearchUsers";
import AdminManageUserPage from "@/routes/(admin)/(user)/AdminManageUser";
import AdminLayout from "@/routes/(admin)/AdminLayout";
import _API_INSTANCE from "@/utils/axios";

import { redirect, type RouteObject } from "react-router";

const AdminRoutes: RouteObject = {
  path: "admin",
  Component: AdminLayout,
  children: [
    {
      index: true,
      Component: AdminManageUsersPage,
    },
    {
      path: "reports",
      children: [
        {
          path: "posts",
          Component: AdminManagePostReportsPage,
          index: true,
        },
        {
          path: "comments",
          Component: AdminManageCommentReportsPage,
          index: true,
        },
        {
          path: "search",
          Component: AdminSearchReportsPage,
        },
      ],
    },
    {
      path: "user/:id",
      Component: AdminManageUserPage,
      loader: async ({ params }) => {
        try {
          const { data } = await _API_INSTANCE.get(
            `admin/auth/user/${params.id}`
          );

          return data;
        } catch {
          redirect(-1 as any);
        }
      },
    },
    {
      path: "users/search",
      Component: AdminSearchUsersPage,
    },
    {
      path: "report",
      children: [
        {
          path: "post/:id",
          Component: AdminManagePostPage,
          loader: async ({ params }) => {
            try {
              const { data } = await _API_INSTANCE.get(
                `admin/forum/report/post/${params.id}`
              );

              return data;
            } catch {
              redirect(-1 as any);
            }
          },
        },
        {
          path: "comment/:id",
          Component: AdminManageCommentPage,
          loader: async ({ params }) => {
            try {
              const { data } = await _API_INSTANCE.get(
                `admin/forum/report/comment/${params.id}`
              );

              return data;
            } catch {
              redirect(-1 as any);
            }
          },
        },
      ],
    },
  ],
};

export default AdminRoutes;
