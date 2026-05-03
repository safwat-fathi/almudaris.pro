import { z } from 'zod';

const educationStageSchema = z.enum([
	"PRIMARY",
	"PREPARATORY",
	"SECONDARY",
	"UNASSIGNED",
] as const);

export const createHomeworkSchema = z.object({
	group_id: z.coerce.number({
		error: "يرجى تحديد المجموعة",
	}),
	title: z
		.string({
			error: "عنوان الواجب مطلوب",
		})
		.min(3, "العنوان يجب أن يتكون من 3 أحرف على الأقل")
		.max(100, "العنوان لا يمكن أن يتجاوز 100 حرف"),
	description: z.string().optional(),
	due_date: z.iso.date().optional().nullable(),
	education_stage: educationStageSchema.optional(),
	education_year: z.coerce.number().int().min(0).max(6).optional(),
});

export type CreateHomeworkInput = z.infer<typeof createHomeworkSchema>;
