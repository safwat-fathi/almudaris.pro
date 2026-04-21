import React from 'react';

interface RecurringOptionsProps {
  editScope: "THIS" | "THIS_AND_FUTURE" | "ALL";
  setEditScope: (scope: "THIS" | "THIS_AND_FUTURE" | "ALL") => void;
}

export function RecurringOptions({ editScope, setEditScope }: RecurringOptionsProps) {
  return (
    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mt-4">
      <h4 className="font-bold text-sm text-orange-800 mb-2">تعديل مجموعة متكررة</h4>
      <div className="space-y-2 text-sm text-orange-900">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="edit_scope" 
            value="THIS" 
            checked={editScope === "THIS"}
            onChange={() => setEditScope("THIS")}
            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
          />
          هذه المجموعة فقط
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="edit_scope" 
            value="THIS_AND_FUTURE" 
            checked={editScope === "THIS_AND_FUTURE"}
            onChange={() => setEditScope("THIS_AND_FUTURE")}
            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
          />
          هذه المجموعة والمجموعات القادمة في نفس السلسلة
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="edit_scope" 
            value="ALL" 
            checked={editScope === "ALL"}
            onChange={() => setEditScope("ALL")}
            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
          />
          جميع المجموعات (ما عدا المكتملة)
        </label>
      </div>
    </div>
  );
}