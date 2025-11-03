import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// هذا هو التصدير الافتراضي الوحيد المسموح به في الملف
export default defineConfig({
  // **التعديل الأهم:** يضبط المسار الأساسي ليتطابق مع اسم المستودع
  base: '/JO-Development-Indicators/', 
  
  plugins: [react()],

  // هذا الجزء قد يكون ضرورياً لضمان عمل المتغيرات البيئية (Env Vars)
  // خاصة عند استخدام Vercel مع مفاتيح API
  define: {
    'process.env': process.env,
  },
});
