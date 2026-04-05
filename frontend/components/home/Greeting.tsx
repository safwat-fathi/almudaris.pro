import { mockUser } from "@/data/mockData";

export default function Greeting() {
  return (
    <section>
      <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
        مساء الخير يا {mockUser.name} 👋
      </h1>
      <p className="text-on-surface-variant mt-1 font-medium">{mockUser.date}</p>
    </section>
  );
}
