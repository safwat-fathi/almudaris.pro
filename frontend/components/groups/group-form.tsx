"use client";

import React, { useState } from 'react';
import { useActionState } from 'react';
import { createGroupAction, updateGroupAction, CreateGroupActionState } from '@/app/actions/group.actions';
import { OverlapWarning } from './overlap-warning';
import { RecurringOptions } from './recurring-options';
import { Group } from '@/services/api/groups';

interface GroupFormProps {
  students: { id: number; name: string }[];
  group?: Group;
}

export function GroupForm({ students, group }: GroupFormProps) {
  const actionToUse = group ? updateGroupAction.bind(null, group.id) : createGroupAction;
  const [state, formAction, isPending] = useActionState<CreateGroupActionState, FormData>(actionToUse, {});
  
  const [locationType, setLocationType] = useState<"Online" | "Physical">(group?.location_type || "Online");
  const [isRecurring, setIsRecurring] = useState(false);
  const [editScope, setEditScope] = useState<"THIS" | "THIS_AND_FUTURE" | "ALL">("THIS");

  const selectedStudentIds = group?.students?.map(s => s.student_id) || [];

  return (
    <form action={formAction} className="space-y-6 rtl">
      <OverlapWarning warnings={state.warnings} />
      
      {state.error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm mb-4">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm mb-4">
          {group ? 'تم التحديث بنجاح.' : 'تم إنشاء المجموعة بنجاح.'}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">اسم المجموعة (اختياري)</label>
        <input 
          type="text" 
          name="title" 
          defaultValue={group?.title || ""}
          placeholder="مثال: فيزياء ثالثة ثانوي"
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        {state.fieldErrors?.title && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.title[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">تاريخ المجموعة</label>
        <input 
          type="date" 
          name="date" 
          required 
          defaultValue={group?.date}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        {state.fieldErrors?.date && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.date[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">وقت البدء (UTC)</label>
          <input 
            type="time" 
            name="start_time" 
            required 
            defaultValue={group?.start_time}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          {state.fieldErrors?.start_time && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.start_time[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">المدة (بالدقائق)</label>
          <input 
            type="number" 
            name="duration_minutes" 
            defaultValue={group?.duration_minutes || 60}
            min="15"
            required 
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          {state.fieldErrors?.duration_minutes && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.duration_minutes[0]}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">الطلاب</label>
        <select 
          name="student_ids" 
          multiple 
          required 
          defaultValue={selectedStudentIds.map(String)}
          className="w-full border border-gray-300 rounded-lg p-2 h-32"
        >
          {students.map(s => (
            <option key={s.id} value={String(s.id)}>{s.name}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">اضغط على Ctrl أو Cmd لاختيار أكثر من طالب</p>
        {state.fieldErrors?.student_ids && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.student_ids[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">نوع المكان</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input 
              type="radio" 
              name="location_type" 
              value="Online" 
              checked={locationType === "Online"}
              onChange={() => setLocationType("Online")}
            />
            أونلاين
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="radio" 
              name="location_type" 
              value="Physical" 
              checked={locationType === "Physical"}
              onChange={() => setLocationType("Physical")}
            />
            حضور (في السنتر)
          </label>
        </div>
      </div>

      {locationType === "Online" ? (
        <div>
          <label className="block text-sm font-medium mb-1">رابط الحصة (Zoom/Meet)</label>
          <input 
            type="url" 
            name="location_link" 
            placeholder="https://..."
            required
            defaultValue={group?.location_link || ""}
            className="w-full border border-gray-300 rounded-lg p-2 text-left"
            dir="ltr"
          />
          {state.fieldErrors?.location_link && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.location_link[0]}</p>}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">مكان الحصة</label>
          <input 
            type="text" 
            name="location_place" 
            placeholder="اسم السنتر..."
            required
            defaultValue={group?.location_place || ""}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          {state.fieldErrors?.location_place && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.location_place[0]}</p>}
        </div>
      )}

      {!group ? (
        <>
          <div>
            <label className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <input 
                type="checkbox" 
                name="is_recurring" 
                value="true"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-medium text-sm">تكرار هذه المجموعة (أسبوعياً)</span>
            </label>
          </div>

          {isRecurring && (
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg mt-2 border border-gray-200">
              <div>
                <label className="block text-sm font-medium mb-1">نمط التكرار</label>
                <select name="recurrence_pattern" className="w-full border border-gray-300 rounded-lg p-2">
                  <option value="WEEKLY">أسبوعياً</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">عدد المرات</label>
                <input 
                  type="number" 
                  name="recurrence_count" 
                  defaultValue="4"
                  min="1"
                  max="24"
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>
          )}
        </>
      ) : group.recurring_series_id ? (
        <RecurringOptions editScope={editScope} setEditScope={setEditScope} />
      ) : null}

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-blue-600 text-white rounded-lg py-3 font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "جاري الحفظ..." : (group ? "حفظ التعديلات" : "إنشاء المجموعة")}
      </button>
    </form>
  );
}