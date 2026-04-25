'use server';

import { createHomeworkSchema, CreateHomeworkInput } from '../../schemas/homework.schema';
import { revalidatePath } from 'next/cache';

export async function createHomework(formData: FormData) {
  // ... (previous logic)
  const rawData: any = {};
	
  formData.forEach((value, key) => {
		rawData[key] = value;
  });
  
  if (rawData.group_id) rawData.group_id = Number(rawData.group_id);
	console.log("rawData", rawData);

  const parsed = createHomeworkSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.message };
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  try {
    const res = await fetch(`${backendUrl}/homework`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      throw new Error('Failed to create homework on backend');
    }

    revalidatePath('/sessions/[id]', 'page');
    return { success: true };
  } catch (error) {
		console.log("error", error);
		
    return { error: 'حدث خطأ أثناء إضافة الواجب' };
  }
}

export async function toggleHomeworkStatus(homeworkId: number, isOpen: boolean) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const res = await fetch(`${backendUrl}/homework/${homeworkId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_open: isOpen }),
    });

    if (!res.ok) {
      throw new Error('Failed to update homework status');
    }

    revalidatePath('/sessions/[id]', 'page');
    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ أثناء تحديث حالة الواجب' };
  }
}

