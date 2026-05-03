import { z } from "zod";

const educationStageSchema = z.enum([
	"PRIMARY",
	"PREPARATORY",
	"SECONDARY",
] as const);

const validYearsByStage: Record<z.infer<typeof educationStageSchema>, number[]> =
	{
		PRIMARY: [1, 2, 3, 4, 5, 6],
		PREPARATORY: [1, 2, 3],
		SECONDARY: [1, 2, 3],
	};

export const createGroupSchema = z
	.object({
		date: z.string().date("التاريخ غير صحيح"),
		start_time: z
			.string()
			.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "صيغة الوقت HH:MM"),
		duration_minutes: z.coerce.number().min(1, "مدة الجلسة مطلوبة"),
		student_ids: z
			.array(z.coerce.number())
			.min(1, "يجب اختيار طالب واحد على الأقل"),
		location_type: z.enum(["Online", "Physical"] as const),
		location_link: z.string().optional(),
		location_place: z.string().optional(),
		title: z.string().optional(),
		education_stage: educationStageSchema,
		education_year: z.coerce.number().int().min(1).max(6),
		is_recurring: z.coerce.boolean().optional(),
		recurrence_pattern: z.string().optional(),
		recurrence_count: z.coerce.number().optional(),
		csrf_token: z.string().optional(), // Used for CSRF validation if implemented
	})
	.superRefine((data, ctx) => {
		if (data.location_type === "Online" && !data.location_link) {
			ctx.addIssue({
				code: "custom",
				message: "رابط الحصة مطلوب",
				path: ["location_link"],
			});
		}
		if (data.location_type === "Physical" && !data.location_place) {
			ctx.addIssue({
				code: "custom",
				message: "مكان الحصة مطلوب",
				path: ["location_place"],
			});
		}
		if (!validYearsByStage[data.education_stage].includes(data.education_year)) {
			ctx.addIssue({
				code: "custom",
				message: "الصف الدراسي غير متاح لهذه المرحلة",
				path: ["education_year"],
			});
		}
	});
