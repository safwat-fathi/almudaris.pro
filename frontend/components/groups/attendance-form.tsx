"use client";

import React, { useActionState } from 'react';
import { Group } from '@/services/api/groups';
import { updateAttendanceAction, markCompleteAction, cancelGroupAction } from '@/app/actions/group.actions';
import { useRouter } from 'next/navigation';

interface AttendanceFormProps {
  group: Group;
}

export function AttendanceForm({ group }: AttendanceFormProps) {
  const isCompleted = group.status === 'Completed';
  const isCancelled = group.status === 'Cancelled';
  
  const actionToUse = updateAttendanceAction.bind(null, group.id);
  const [state, formAction, isPending] = useActionState(actionToUse, {});
  const router = useRouter();

  if (isCancelled) {
    return null;
  }

  const handleMarkComplete = async () => {
    if (confirm('هل أنت متأكد من وضع علامة "مكتملة" على هذه المجموعة؟ ستُقفل تفاصيل المجموعة عن التعديل.')) {
      await markCompleteAction(group.id);
    }
  };

  const handleCancelGroup = async () => {
    if (confirm('هل أنت متأكد من إلغاء هذه المجموعة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      const res = await cancelGroupAction(group.id);
      if (res?.success) {
        router.push('/groups');
      } else {
        alert(res?.error || 'حدث خطأ أثناء الإلغاء');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6 rtl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">الحضور والملاحظات</h3>
        
        <div className="flex gap-2">
          {!isCompleted && (
            <>
              <button 
                type="button" 
                onClick={handleMarkComplete}
                className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-bold hover:bg-green-200"
              >
                ✓ تعيين كمكتملة
              </button>
              <button 
                type="button" 
                onClick={handleCancelGroup}
                className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-bold hover:bg-red-200"
              >
                إلغاء المجموعة
              </button>
            </>
          )}
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        {state.error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
            {state.error}
          </div>
        )}
        
        {state.success && (
          <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm">
            تم حفظ الحضور والملاحظات بنجاح.
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-3 rounded-tr-lg">الطالب</th>
                <th className="p-3 w-40 text-center">الحضور</th>
                <th className="p-3 rounded-tl-lg">ملاحظة للطالب</th>
              </tr>
            </thead>
            <tbody>
              {group.students?.map((student) => (
                <tr key={student.student_id} className="border-b border-gray-100 last:border-0">
                  <td className="p-3 font-medium text-gray-800 whitespace-nowrap">
                    {student.student_name}
                  </td>
                  <td className="p-3">
                    <select 
                      name={`student_${student.student_id}_status`}
                      defaultValue={student.attendance_status}
                      className="w-full border border-gray-300 rounded p-1 text-sm bg-white"
                    >
                      <option value="Present">حاضر</option>
                      <option value="Absent">غائب</option>
                      <option value="Not set">لم يُحدد</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input 
                      type="text" 
                      name={`student_${student.student_id}_note`}
                      defaultValue={student.note || ""}
                      placeholder="أضف ملاحظة..."
                      className="w-full border border-gray-300 rounded p-1 text-sm"
                    />
                  </td>
                </tr>
              ))}
              {(!group.students || group.students.length === 0) && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500">لا يوجد طلاب في هذه المجموعة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ملاحظات عامة على المجموعة</label>
          <textarea 
            name="notes" 
            defaultValue={group.notes || ""}
            rows={3}
            placeholder="مثال: تم تغطية الباب الأول من المنهج بنجاح..."
            className="w-full border border-gray-300 rounded-lg p-2"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-blue-600 text-white rounded-lg py-3 font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "جاري الحفظ..." : "حفظ الحضور والملاحظات"}
        </button>
      </form>
    </div>
  );
}