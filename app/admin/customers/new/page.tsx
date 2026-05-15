import Link from 'next/link';
import { Topbar } from '../../_components/Topbar';
import { CustomerForm } from './customer-form';

export const metadata = {
  title: 'לקוח חדש · הבונקר',
};

export default function NewCustomerPage() {
  return (
    <>
      <Topbar
        title="לקוח חדש"
        subtitle="הוספת לקוח חדש למערכת"
        actions={
          <Link
            href="/admin/customers"
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/70 hover:text-white transition-colors font-[family-name:var(--font-en)]"
          >
            ← חזרה
          </Link>
        }
      />

      <div className="max-w-xl bg-[#181818] border border-white/10 rounded-2xl p-8">
        <CustomerForm />
      </div>
    </>
  );
}
