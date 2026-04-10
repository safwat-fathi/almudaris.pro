import { cookies } from "next/headers";
import { formatDate } from "@/lib/format";

export default async function Greeting() {
  const cookieStore = await cookies();
  const userDataStr = cookieStore.get("user_data")?.value;
  
  // Default values
  const user = { 
    name: "مستخدم", 
    date: formatDate(new Date()) 
  };

  if (userDataStr) {
    try {
      const parsed = JSON.parse(userDataStr);
      user.name = parsed.name || user.name;
    } catch {
      // Ignore parsing errors, fallback to default
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
        مساء الخير يا {user.name} 👋
      </h1>
      <p className="text-on-surface-variant mt-1 font-medium">{user.date}</p>
    </section>
  );
}
