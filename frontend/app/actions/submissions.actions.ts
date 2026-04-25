'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const submitSchema = z.object({
  homework_id: z.number(),
  student_id: z.number(),
  answer_text: z.string().optional(),
});

export async function submitHomework(formData: FormData) {
  const rawData = {
    homework_id: Number(formData.get('homework_id')),
    student_id: Number(formData.get('student_id')),
    answer_text: formData.get('answer_text') as string,
  };

  const parsed = submitSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: 'بيانات غير صالحة' };
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const res = await fetch(`${backendUrl}/homework/${parsed.data.homework_id}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: parsed.data.student_id,
        answer_text: parsed.data.answer_text,
        attachments: [], // Future: Handle attachments here
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to submit homework');
    }

    revalidatePath('/homework');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ أثناء تقديم الواجب' };
  }
}
