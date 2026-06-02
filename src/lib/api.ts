export const API_URL =
    process.env.NEXT_PUBLIC_API_Course_URL ??
    "https://lms-course-service-api-gtd2cbc0dhesgjd5.germanywestcentral-01.azurewebsites.net";


    // ============================================================
// API HELPER – All requests go through API Gateway
// ============================================================

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    emailConfirmed: boolean;
  };
  requiresEmailVerification?: boolean;
}

// ============================================================
// AUTH API CALLS (via API Gateway)
// ============================================================

export const authApi = {
  /**
   * Register a new user.
   * POST /auth/Auth/register
   */
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }): Promise<ApiResponse<TokenResponse>> => {
    return request(`${API_GATEWAY_URL}/auth/Auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Login with email and password.
   * POST /auth/Auth/login
   */
  login: async (data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<TokenResponse>> => {
    return request(`${API_GATEWAY_URL}/auth/Auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify email with code.
   * POST /auth/Auth/verify-email
   */
  verifyEmail: async (data: {
    email: string;
    code: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    return request(`${API_GATEWAY_URL}/auth/Auth/verify-email`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Resend verification code.
   * POST /auth/Auth/resend-verification
   */
  resendVerification: async (data: {
    email: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    return request(`${API_GATEWAY_URL}/auth/Auth/resend-verification`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Refresh access token.
   * POST /auth/Auth/refresh
   */
  refreshToken: async (
    refreshToken: string,
  ): Promise<ApiResponse<TokenResponse>> => {
    return request(`${API_GATEWAY_URL}/auth/Auth/refresh`, {
      method: "POST",
      body: JSON.stringify(refreshToken),
    });
  },

  /**
   * Logout (revoke refresh token).
   * POST /auth/Auth/logout
   */
  logout: async (refreshToken: string): Promise<ApiResponse<void>> => {
    const token = getAccessToken();
    return request(`${API_GATEWAY_URL}/auth/Auth/logout`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(refreshToken),
    });
  },

  /**
   * Validate current JWT token.
   * GET /auth/Auth/validate
   */
  validate: async (): Promise<ApiResponse<TokenResponse["user"]>> => {
    const token = getAccessToken();
    if (!token) return { data: null, error: "No token", status: 401 };

    return request(`${API_GATEWAY_URL}/auth/Auth/validate`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// ============================================================
// CONTENT API CALLS (via API Gateway)
// Gateway routes /content/* → Content Service
// ============================================================
/** GET /content/courses/{courseId}/modules */
export const contentApi = {
getModules: async (courseId: string | number, pageNumber = 1, pageSize = 10) => {
  return request<PaginatedModules>(
    `${API_GATEWAY_URL}/content/content/courses/${courseId}/modules?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    { headers: authHeaders() },
  );
},

  /** GET /content/modules/{moduleId}/lessons */
  getLessons: async (moduleId: string, pageNumber = 1, pageSize = 10) => {
    return request<PaginatedLessons>(
      `${API_GATEWAY_URL}/content/content/modules/${moduleId}/lessons?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      { headers: authHeaders() },
    );
  },

  /** GET /content/lessons/{lessonId} */
  getLesson: async (lessonId: string) => {
    return request<LessonDto>(
      `${API_GATEWAY_URL}/content/content/lessons/${lessonId}`,
      { headers: authHeaders() },
    );
  },

  // ==========================================================
  // INSTRUCTOR/ADMIN ENDPOINTS (Requires JWT)
  // ==========================================================

/** POST /content/courses/{courseId}/modules */
createModule: async (
  courseId: string | number,
  data: { title: string; description?: string; order: number },
) => {
  return request<ModuleDto>(
    `${API_GATEWAY_URL}/content/content/courses/${courseId}/modules`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    },
  );
},

  /** PUT /content/modules/{moduleId} */
  updateModule: async (
    moduleId: string,
    data: { title: string; description?: string; order: number },
  ) => {
    return request<ModuleDto>(
      `${API_GATEWAY_URL}/content/content/modules/${moduleId}`,
      { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) },
    );
  },

  /** DELETE /content/modules/{moduleId} */
  deleteModule: async (moduleId: string) => {
    return request<{ message: string }>(
      `${API_GATEWAY_URL}/content/content/modules/${moduleId}`,
      { method: "DELETE", headers: authHeaders() },
    );
  },

  /** POST /content/modules/{moduleId}/lessons */
  createLesson: async (
    moduleId: string,
    data: {
      title: string;
      content?: string;
      videoUrl?: string;
      order: number;
      durationMinutes: number;
    },
  ) => {
    return request<LessonDto>(
      `${API_GATEWAY_URL}/content/content/modules/${moduleId}/lessons`,
      { method: "POST", headers: authHeaders(), body: JSON.stringify(data) },
    );
  },

  /** PUT /content/lessons/{lessonId} */
  updateLesson: async (
    lessonId: string,
    data: {
      title: string;
      content?: string;
      videoUrl?: string;
      order: number;
      durationMinutes: number;
    },
  ) => {
    return request<LessonDto>(
      `${API_GATEWAY_URL}/content/content/lessons/${lessonId}`,
      { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) },
    );
  },

  /** POST /content/lessons/{lessonId}/publish */
  publishLesson: async (lessonId: string) => {
    return request<{ message: string }>(
      `${API_GATEWAY_URL}/content/content/lessons/${lessonId}/publish`,
      { method: "POST", headers: authHeaders() },
    );
  },

  /** POST /content/lessons/{lessonId}/resources */
  attachResource: async (
    lessonId: string,
    fileId: string,
    resourceType: string = "Document",
  ) => {
    return request<{ message: string }>(
      `${API_GATEWAY_URL}/content/content/lessons/${lessonId}/resources`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ fileId, resourceType }),
      },
    );
  },
};

// ============================================================
// API KEYS (for internal service-to-service calls)
// ============================================================
const INTERNAL_API_KEYS = {
  enrollmentService: process.env.NEXT_PUBLIC_ENROLLMENT_SERVICE_API_KEY || "",
  contentService: process.env.NEXT_PUBLIC_CONTENT_SERVICE_API_KEY || "",
};

// ============================================================
// ENROLLMENT API CALLS (via API Gateway)
// ============================================================

export const enrollmentApi = {
  /**
   * Enroll in a course.
   * POST /enrollments/enrollments
   * Auth: JWT Bearer Token (Student)
   */
  enroll: async (
    courseId: string | number,
  ): Promise<ApiResponse<EnrollmentResponse>> => {
    const token = getAccessToken();
    if (!token) {
      return { data: null, error: "Not authenticated", status: 401 };
    }

    return request<EnrollmentResponse>(
      `${API_GATEWAY_URL}/enrollments/enrollments`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId }),
      },
    );
  },

  /**
   * Unenroll (drop) from a course.
   * DELETE /enrollments/enrollments/{courseId}
   * Auth: JWT Bearer Token (Student)
   */
  unenroll: async (
    courseId: string | number,
  ): Promise<ApiResponse<EnrollmentResponse>> => {
    const token = getAccessToken();
    if (!token) {
      return { data: null, error: "Not authenticated", status: 401 };
    }

    return request<EnrollmentResponse>(
      `${API_GATEWAY_URL}/enrollments/enrollments/${courseId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },

  /**
   * Get current user's enrolled courses.
   * GET /enrollments/enrollments/my-courses
   * Auth: JWT Bearer Token (Student)
   */
  getMyEnrollments: async (
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<ApiResponse<PaginatedEnrollments>> => {
    const token = getAccessToken();
    if (!token) {
      return { data: null, error: "Not authenticated", status: 401 };
    }

    return request<PaginatedEnrollments>(
      `${API_GATEWAY_URL}/enrollments/enrollments/my-courses?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },

  /**
   * Check if a user is enrolled in a course (INTERNAL API).
   * GET /enrollments/internal/enrollments/check
   * Auth: API Key (X-Api-Key header)
   */
  checkEnrollment: async (
    userId: string,
    courseId: string | number,
  ): Promise<ApiResponse<EnrollmentCheckResponse>> => {
    return request<EnrollmentCheckResponse>(
      `${API_GATEWAY_URL}/enrollments/internal/enrollments/check?userId=${userId}&courseId=${courseId}`,
      {
        headers: {
          "X-Api-Key": INTERNAL_API_KEYS.enrollmentService,
        },
      },
    );
  },

  /**
   * Get enrollment count for a course (INTERNAL API).
   * GET /enrollments/internal/enrollments/course/{courseId}/count
   * Auth: API Key (X-Api-Key header)
   */
  getEnrollmentCount: async (
    courseId: string | number,
  ): Promise<ApiResponse<EnrollmentCountResponse>> => {
    return request<EnrollmentCountResponse>(
      `${API_GATEWAY_URL}/enrollments/internal/enrollments/course/${courseId}/count`,
      {
        headers: {
          "X-Api-Key": INTERNAL_API_KEYS.enrollmentService,
        },
      },
    );
  },
};

// ============================================================
// ENROLLMENT TYPES
// ============================================================

interface EnrollmentResponse {
  success: boolean;
  message: string;
  enrollment: EnrollmentDto | null;
  addedToWaitlist: boolean;
  waitlistPosition: number | null;
}

interface EnrollmentDto {
  id: string;
  userId: string;
  courseId: string | number;
  status: string;
  enrolledAt: string;
  completedAt: string | null;
  droppedAt: string | null;
  courseHasContent: boolean;
}

interface PaginatedEnrollments {
  items: EnrollmentDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface EnrollmentCheckResponse {
  userId: string;
  courseId: string | number;
  enrolled: boolean;
}

interface EnrollmentCountResponse {
  courseId: string | number;
  count: number;
}

// ============================================================
// HELPER: Auth Headers
// ============================================================
function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// ============================================================
// CONTENT TYPES
// ============================================================

interface ModuleDto {
  id: string;
  courseId: string | number;
  title: string;
  description: string | null;
  order: number;
  lessonCount: number;
  totalDurationMinutes: number;
  createdAt: string;
  updatedAt: string | null;
  lessons: LessonDto[];
}

interface LessonDto {
  id: string;
  moduleId: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  order: number;
  durationMinutes: number;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  resources: ResourceDto[];
}

interface ResourceDto {
  id: string;
  fileId: string;
  resourceType: string;
  attachedAt: string;
}

interface PaginatedModules {
  items: ModuleDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface PaginatedLessons {
  items: LessonDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ============================================================
// TOKEN MANAGEMENT
// ============================================================

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const getUser = (): TokenResponse["user"] | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setUser = (user: TokenResponse["user"]): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

// ============================================================
// GENERIC REQUEST HELPER
// ============================================================

async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers as Record<string, string>),
      },
    });

    let data: any = null;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      return {
        data: null,
        error:
          data?.message ||
          data?.error ||
          `Request failed with status ${response.status}`,
        status: response.status,
      };
    }

    return { data, error: null, status: response.status };
  } catch (err: any) {
    return {
      data: null,
      error: err.message || "Network error",
      status: 0,
    };
  }
}