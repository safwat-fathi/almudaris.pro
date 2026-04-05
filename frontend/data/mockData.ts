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
    date: "٢٤ مايو ٢٠٢٤",
    location: "السنتر / المكان الرئيسي",
    studentsCount: "٢٠ طالب",
    icon: "functions",
    color: "primary",
    status: "active",
  },
  {
    id: "2",
    title: "فيزياء - الصف الثالث الثانوي",
    batch: "دفعة: ثانية ثانوي",
    time: "٠٧:٠٠ - ٨:٣٠ م",
    date: "٢٤ مايو ٢٠٢٤",
    location: "السنتر / القاعة الثانية",
    studentsCount: "٨ طلاب",
    icon: "school",
    color: "surface-variant",
    status: "upcoming",
  }
];

export const mockQuickActions = [
  { id: "1", label: "إضافة طالب", icon: "person_add" },
  { id: "2", label: "إضافة حصة", icon: "calendar_add_on" },
  { id: "3", label: "تسجيل دفع", icon: "payments" },
  { id: "4", label: "ملاحظة", icon: "note_alt" },
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
  totalStudents: "128",
  collectionRate: "92%",
  activeSessions: "04"
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
