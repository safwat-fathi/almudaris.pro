export const mockUser = {
  name: "أستاذ أحمد",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuANehGkvSCv7M7-ji_wMs8VEJ8BjC_yv-rLDU3Lq9ug_BCVFC6y9HgKVLEfeFtyIj19YoFpL1wIxLz1-wuJ6zBV6lfC1jGPuwWTVBAb1BsinVCorxHsWu9bLK1pbZh1I6oUxnlWxFr6_o4P7KHbYxx7GdH2l7Ho9n86Mzixb8ocCGsftTmXpt9degJ27OQNfRPq8EHoGHX0KSLXJgZ0P0OuGjVjiSaV4_c81Kz--SxMu0ih-P4RaAvzi0s46jnlJPPlWTj8W3dlPfc",
  date: "اليوم هو الثلاثاء، ٢٤ أكتوبر ٢٠٢٣"
};

export const mockSessions = [
	{
		id: "1",
		title: "مجموعة التجمع الاول",
		batch: "دفعة: تالتة ثانوي",
		time: "٥:٠٠ - ٦:٣٠ م",
		date: new Date("2024-05-24T14:00:00Z"),
		location: "السنتر / المكان الرئيسي",
		studentsCount: 20,
		icon: "functions",
		color: "primary",
		status: "active",
	},
	{
		id: "2",
		title: "فيزياء - الصف الثالث الثانوي",
		batch: "دفعة: ثانية ثانوي",
		time: "٠٧:٠٠ - ٨:٣٠ م",
		date: new Date("2024-05-24T16:00:00Z"),
		location: "السنتر / القاعة الثانية",
		studentsCount: 8,
		icon: "school",
		color: "surface-variant",
		status: "upcoming",
	},
];

export const mockQuickActions = [
	{
		id: "1",
		label: "إضافة طالب",
		icon: "person_add",
		href: "/students/invite",
	},
	{
		id: "2",
		label: "إضافة حصة",
		icon: "calendar_add_on",
		href: "/sessions/new",
	},
	{ id: "3", label: "تسجيل دفع", icon: "payments", href: "/payments/new" },
	{ id: "4", label: "رابط الدعوة", icon: "qr_code", href: "/profile/invite" },
];

export const mockAlerts = [
  {
    id: "1",
    title: "متأخرات مالية",
    description: "٣ طلاب لم يسددوا اشتراك الشهر الحالي في مجموعة الرياضيات.",
    type: "error",
    icon: "error"
  },
  {
    id: "2",
    title: "تذكير بالتحضير",
    description: "حان وقت تحضير أوراق عمل حصة الفيزياء القادمة.",
    type: "warning", 
    icon: "notifications_active"
  },
  {
    id: "3",
    title: "حصص فائتة",
    description: "لم يتم تسجيل غياب حصة الأمس لمجموعة الكيمياء.",
    type: "default",
    icon: "history"
  }
];

export const mockStats = {
	totalStudents: 128,
	collectionRate: 0.92,
	activeSessions: 4,
};

export const mockStudents = [
  {
    id: "1",
    name: "أحمد محمد العتيبي",
    group: "المستوى الثالث - أ",
    paymentStatus: "paid",
    subscriptionStatus: "active",
    isNew: false,
    lastSession: "12 مايو 2024",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZb8zMQ25aODxxkGHEz2NlPcXLUSmW3PH_oz-43IfQ0Pz5EQpBitfSJ1Q8EcUfcf45rZFpxjrSj_Je7hokdjRR961K27QlCw56-Th02hqAVoIGDD_PD_4roN5w9mwm3xluZFBDY2vcF7gO4IfcwpoK5qXHB2MJLw_cdYTfsJyZbaauCgwAqJS_nEPwjMDrGFEbTajEGs9GVhhmTrUmnmjL9Zq73roBxVs5OvIbgpElTI2XNHut4I2drsC9L5Q3NSj0zb5FySTb17w",
    initials: ""
  },
  {
    id: "2",
    name: "سارة خالد الشمري",
    group: "المستوى الثاني - ب",
    paymentStatus: "unpaid",
    subscriptionStatus: "expired",
    isNew: true,
    lastSession: "11 مايو 2024",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeM48HksRScah3Bq8hqkOx8SjAQbrPem5vUYClLTa9pQ9hYjcjkJSsxMaglbqIj--enXRttEhurqNKHMVDLFf39-OQ9-LIdVPAPZKs6WMj74VYl4BKpT3324xZqxjsG0Lr8cHL3n62fY12BwVRWKbZEbE7Sl_ad4vNGXqx5G5iMTn6kaKc930em5wf-RDQfEbzxkHgV0HPJ0i5w9nUCLQURbzgAwVLFHZvLW-JlT7ZB3IssyMbtFeh02eMdNZsHgyI5bpkfSQ7r-E",
    initials: ""
  },
  {
    id: "3",
    name: "عمر محمود حسن",
    group: "المستوى الثالث - أ",
    paymentStatus: "paid",
    subscriptionStatus: "active",
    isNew: false,
    lastSession: "12 مايو 2024",
    avatar: "",
    initials: "ع م"
  },
  {
    id: "4",
    name: "فيصل عبدالرحمن",
    group: "المستوى الأول - ج",
    paymentStatus: "paid",
    subscriptionStatus: "active",
    isNew: false,
    lastSession: "10 مايو 2024",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpZmbsAJJqYHr7E_NlBgB3shtqrHNUn4F4-uWFpquhyxNClO8x1ZcrMAVRsq11qwZCvh8TpBdp2QQ4IbhJqpUAIpRuwmj_IAZ_7KQgxpGlLcD-Knmh55T5ZBqafW_UE3HOgZqpXXtoUXPpEIVhJ1dAr3gLQDySzSfrdt2TbCptGntryivbEfstrW_bGot4a-jOfyNsVi9Bp3BifBf6EfmMSW4Pnrwr0--iBdgm-hduGXdoHQoSPlp4msykrqaOoWchDtuX2OBRbo0",
    initials: ""
  }
];

export const mockSelectedHomework = {
	id: "1",
	title: "حل تمارين ص ٣٠ - تالتة ثانوي",
	totalStudents: 20,
	submittedCount: 15,
	remainingCount: 5,
	completionPercentage: 75,
	delayedCount: 5,
};

export const mockSubmissions = [
	{
		id: "1",
		studentName: "أحمد محمد",
		status: "submitted",
		avatar:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuD59s0y1K3_0mlIvCUcLiPeYxDCrCrEnBJPvUwnaYrm0jE849T7iksDC-So8WxGxRa5FFgy3MAwUkG0GL7MuEohwYtkXHNfmLXwecbSyxF7K23M_ZQPis4KDKr-jV1-db0fMxLINzVmXbs3dtE72bKQYEp7R3NU4ZC6JyTBqHIueGe-ojczs6MHHlcx7kcXpxQyFismBoGaDSD_HeCZpDlVzHMysd9xdzaGApn_15xoltSbTvCv8TQ-JEWuhyrW0DU7XhQYC64k1j0",
	},
	{
		id: "2",
		studentName: "سارة خالد",
		status: "not_submitted",
		avatar:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuA_DAJ7evye7hQOM8ojoN0IhS6y4Z-sQqBlUTfqWhNt0O-XGZhpVc5QKXhaMAG5GaNgtHGPjZeYSLsG5QKOFJJ8hTEJGquvAvF3AMJlEqNJPBIFgdAScuDI8snPbI8LE_EMdCa2BVdsO2E0U7TvaGlEdjvtStwHtdqy8H2BWA5897TjSVozvJ-awChrKnxPdqAl-2JtyyOQumyvmSlBmxhgCePzvKEpBAxoubgC26MMksJrPDDFfzgQoyudxsc70yg4UvwfhsW9W_g",
	},
	{
		id: "3",
		studentName: "محمد علي",
		status: "submitted",
		avatar:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAQbDnBiauhVxRNSDFoUrSFhJNkkxhivHQskQjTYeqigpQ9_9e5vBwq4H5WNrRugH4_tQ9UcN9xpScKU3jQUgBi91oshCHRlQ3AZbF9IgafrE4OqaOzsa3bYqLxN9UUIXoRyJgs7kuARSSStyZ30GHJPe7kPtBGHlpwFW4gII8J2ZBf3H5rn9RmMm6w3kziGvi5-nGY4ocfX5o7km9YdmJA-rqWK1jHGTxYMccgU2b1F6iBfQlumMAdhyhhByPc8BolyoQ21xQcVUc",
	},
	{
		id: "4",
		studentName: "ياسين عمر",
		status: "submitted",
		avatar:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuA07dbQ_a0IL8TWZ4owdOGUdMya3uHx6nCnBD-sTaULYRP5rSh_iwWs7W22CyMarUWAdTeTn5CUT9CUY3nNEXYE73l4K0MFKfmMp-JV0AjLc-Z_-4Nu5lOkr-_NJoMAPwGEVlTqC2s8TCgXxa8ogt5FyMCNzBwnMhr6iVEq5I7cH2PsTh3Y2J2aCiDeTsJYxCq41NO5pUGBKBCiqoVXQFBF5S8_ysOegreSCaKDf_-CoAKoYklJKN8Cklh9-yRQTBmOfFkhEgAa0sQ",
	},
];
