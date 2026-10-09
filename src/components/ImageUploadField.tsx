"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploadField({
  restaurantId,
  name,
}: {
  restaurantId: string;
  name: string;
}) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("فقط فایل‌های JPG، PNG یا WebP مجاز هستند");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`حجم فایل نباید بیشتر از ${MAX_SIZE_MB} مگابایت باشد`);
      return;
    }

    setIsUploading(true);

    const supabase = createClient();
    const extension = file.name.split(".").pop();
    const fileName = `${restaurantId}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("menu-images")
      .upload(fileName, file, { upsert: false });

    setIsUploading(false);

    if (uploadError) {
      setError("خطا در آپلود تصویر");
      return;
    }

    const { data } = supabase.storage.from("menu-images").getPublicUrl(fileName);
    setUploadedUrl(data.publicUrl);
  }

  return (
    <div>
      <label className="mb-1 block text-sm text-gray-600">تصویر غذا</label>

      <input type="hidden" name={name} value={uploadedUrl ?? ""} />

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-black"
      />

      {isUploading && (
        <p className="mt-1 text-xs text-gray-500">در حال آپلود...</p>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {uploadedUrl && !isUploading && (
        <img
          src={uploadedUrl}
          alt="پیش‌نمایش"
          className="mt-2 h-24 w-24 rounded-lg object-cover"
        />
      )}
    </div>
  );
}