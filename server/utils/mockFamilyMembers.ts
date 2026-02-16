/**
 * Mock data for family members API when external API is down or MOCK_FAMILY_MEMBERS_API=true.
 * Use for local/testing when the real API is unavailable.
 */

const PLACEHOLDER_PHOTO = "/logo.svg";

export const mockFamilyMembersSearch = {
  success: true,
  status: 200,
  message: "OK",
  data: {
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 4,
    data: [
      {
        id: 1,
        title: "صاحب السمو",
        fullName: "سلطان بن محمد بن صقر القاسمي",
        mobile: null,
        bod: null,
        gender: "ذكر",
        jobTitle: null,
        branch: null,
        education: null,
        isStillLive: true,
        motherName: null,
        wifeName: null,
        photoUrl: PLACEHOLDER_PHOTO,
      },
      {
        id: 2,
        title: "",
        fullName: "ناصر بن ماجد القاسمي",
        mobile: null,
        bod: null,
        gender: "ذكر",
        jobTitle: null,
        branch: null,
        education: null,
        isStillLive: true,
        motherName: null,
        wifeName: null,
        photoUrl: PLACEHOLDER_PHOTO,
      },
      {
        id: 3,
        title: "",
        fullName: "ماجد بن ناصر القاسمي",
        mobile: null,
        bod: null,
        gender: "ذكر",
        jobTitle: null,
        branch: null,
        education: null,
        isStillLive: true,
        motherName: null,
        wifeName: null,
        photoUrl: PLACEHOLDER_PHOTO,
      },
      {
        id: 4,
        title: "",
        fullName: "راشد بن مطر القاسمي",
        mobile: null,
        bod: null,
        gender: "ذكر",
        jobTitle: null,
        branch: null,
        education: null,
        isStillLive: false,
        motherName: null,
        wifeName: null,
        photoUrl: PLACEHOLDER_PHOTO,
      },
    ],
  },
  errors: null,
};

export const mockMemberDetails: Record<
  string,
  {
    success: boolean;
    status: number;
    message: string;
    data: {
      id: number;
      title: string;
      fullName: string;
      mobile: string | null;
      bod: string | null;
      isStillLive: boolean;
      gender: string;
      bio: string | null;
      jobTitle: string | null;
      branch: string | null;
      education: string | null;
      photoUrl: string;
      relations: Array<{ relatedFullName: string; relationType: string }>;
      parent: {
        id: number;
        title: string;
        fullName: string;
        photo: string;
        isStillLive: boolean;
        parent: any;
      } | null;
      childs: Array<{ relatedFullName: string; relationType: string }>;
    };
    errors: any;
  }
> = {
  "1": {
    success: true,
    status: 200,
    message: "OK",
    data: {
      id: 1,
      title: "صاحب السمو",
      fullName: "سلطان بن محمد بن صقر القاسمي",
      mobile: null,
      bod: null,
      isStillLive: true,
      gender: "ذكر",
      bio: null,
      jobTitle: null,
      branch: null,
      education: null,
      photoUrl: PLACEHOLDER_PHOTO,
      relations: [],
      parent: {
        id: 10,
        title: "",
        fullName: "محمد بن صقر القاسمي",
        photo: PLACEHOLDER_PHOTO,
        isStillLive: false,
        parent: null,
      },
      childs: [],
    },
    errors: null,
  },
  "2": {
    success: true,
    status: 200,
    message: "OK",
    data: {
      id: 2,
      title: "",
      fullName: "ناصر بن ماجد القاسمي",
      mobile: null,
      bod: null,
      isStillLive: true,
      gender: "ذكر",
      bio: null,
      jobTitle: null,
      branch: null,
      education: null,
      photoUrl: PLACEHOLDER_PHOTO,
      relations: [],
      parent: {
        id: 20,
        title: "",
        fullName: "ماجد بن ناصر القاسمي",
        photo: PLACEHOLDER_PHOTO,
        isStillLive: false,
        parent: {
          id: 200,
          title: "",
          fullName: "ناصر بن سلطان القاسمي",
          photo: PLACEHOLDER_PHOTO,
          isStillLive: false,
          parent: null,
        },
      },
      childs: [],
    },
    errors: null,
  },
  "3": {
    success: true,
    status: 200,
    message: "OK",
    data: {
      id: 3,
      title: "",
      fullName: "ماجد بن ناصر القاسمي",
      mobile: null,
      bod: null,
      isStillLive: true,
      gender: "ذكر",
      bio: null,
      jobTitle: null,
      branch: null,
      education: null,
      photoUrl: PLACEHOLDER_PHOTO,
      relations: [],
      parent: {
        id: 30,
        title: "",
        fullName: "ناصر بن سلطان القاسمي",
        photo: PLACEHOLDER_PHOTO,
        isStillLive: false,
        parent: null,
      },
      childs: [],
    },
    errors: null,
  },
  "4": {
    success: true,
    status: 200,
    message: "OK",
    data: {
      id: 4,
      title: "",
      fullName: "راشد بن مطر القاسمي",
      mobile: null,
      bod: null,
      isStillLive: false,
      gender: "ذكر",
      bio: null,
      jobTitle: null,
      branch: null,
      education: null,
      photoUrl: PLACEHOLDER_PHOTO,
      relations: [],
      parent: {
        id: 40,
        title: "",
        fullName: "مطر بن كايد القاسمي",
        photo: PLACEHOLDER_PHOTO,
        isStillLive: false,
        parent: null,
      },
      childs: [],
    },
    errors: null,
  },
};

/** Default details mock for any ID not in mockMemberDetails (e.g. 10, 20, 30, 40, 200) */
export function getMockMemberDetails(id: string) {
  if (mockMemberDetails[id]) {
    return mockMemberDetails[id];
  }
  return {
    success: true,
    status: 200,
    message: "OK",
    data: {
      id: Number(id) || 99,
      title: "",
      fullName: `عضو تجريبي ${id}`,
      mobile: null,
      bod: null,
      isStillLive: true,
      gender: "ذكر",
      bio: null,
      jobTitle: null,
      branch: null,
      education: null,
      photoUrl: PLACEHOLDER_PHOTO,
      relations: [],
      parent: null,
      childs: [],
    },
    errors: null,
  };
}

/** Mock search-between: common ancestor between person 1 and 2, or 2 and 3, etc. */
export function getMockSearchBetween(id1: string, id2: string) {
  const ids = [id1, id2].map(Number).sort((a, b) => a - b);
  const [a, b] = ids;

  const commonAncestor = {
    id: 100,
    title: "",
    fullName: "سلطان بن صقر القاسمي",
    photo: PLACEHOLDER_PHOTO,
    isStillLive: false,
    parent: null,
  };

  const member1 = [
    { id: a, title: "", fullName: `شخص ${a}`, photo: PLACEHOLDER_PHOTO, isStillLive: true, parent: null },
    { id: 101, title: "", fullName: "محمد بن صقر القاسمي", photo: PLACEHOLDER_PHOTO, isStillLive: false, parent: null },
  ];
  const member2 = [
    { id: b, title: "", fullName: `شخص ${b}`, photo: PLACEHOLDER_PHOTO, isStillLive: true, parent: null },
    { id: 102, title: "", fullName: "صقر بن راشد القاسمي", photo: PLACEHOLDER_PHOTO, isStillLive: false, parent: null },
  ];

  return {
    success: true,
    status: 200,
    message: "OK",
    data: {
      member1,
      member2,
      commonAncestor,
    },
    errors: null,
  };
}
