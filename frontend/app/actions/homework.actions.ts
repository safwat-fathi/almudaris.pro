'use server';

import { createHomeworkSchema } from '../../schemas/homework.schema';
import { revalidatePath } from 'next/cache';
import { homeworkService } from '@/services/api/homework';

export async function createHomework(formData: FormData) {
  const rawData: Record<string, unknown> = {};
	
  formData.forEach((value, key) => {
		rawData[key] = value;
  });
  
  if (rawData.group_id) rawData.group_id = Number(rawData.group_id);
  if (typeof rawData.title === 'string') rawData.title = rawData.title.trim();
  if (typeof rawData.description === 'string') {
    const description = rawData.description.trim();
    if (description.length === 0) {
      delete rawData.description;
    } else {
      rawData.description = description;
    }
  }
  if (rawData.due_date === '') {
    rawData.due_date = null;
  }

  const parsed = createHomeworkSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.message };
  }

  try {
    await homeworkService.createHomework(parsed.data);
    revalidatePath('/sessions');
    revalidatePath(`/sessions/${parsed.data.group_id}`);
    revalidatePath('/sessions/[id]', 'page');
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error && error.message) {
      return { error: error.message };
    }
    return { error: 'حدث خطأ أثناء إضافة الواجب' };
  }
}

export async function toggleHomeworkStatus(homeworkId: number, isOpen: boolean) {
  try {
    await homeworkService.toggleHomeworkStatus(homeworkId, isOpen);
    revalidatePath('/sessions');
    revalidatePath('/sessions/[id]', 'page');
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error && error.message) {
      return { error: error.message };
    }
    return { error: 'حدث خطأ أثناء تحديث حالة الواجب' };
  }
}
