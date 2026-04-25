import { z } from 'zod';

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
});

export type CreateHomeworkInput = z.infer<typeof createHomeworkSchema>;
