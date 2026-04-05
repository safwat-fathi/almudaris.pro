import { mockAlerts } from "@/data/mockData";

export default function AlertsList() {
  // Helper to get classes based on alert type
  const getAlertStyles = (type: string) => {
    switch(type) {
      case "error":
        return {
          bg: "bg-error-container/40",
          title: "text-error",
          desc: "text-on-error-container",
          icon: "text-error",
          iconFill: 1
        };
      case "warning":
        return {
          bg: "bg-secondary-container/30",
          title: "text-secondary",
          desc: "text-on-secondary-container",
          icon: "text-secondary",
          iconFill: 1
        };
      case "default":
      default:
        return {
          bg: "bg-surface-container-high/50",
          title: "text-on-surface-variant",
          desc: "text-on-surface-variant/80",
          icon: "text-on-surface-variant",
          iconFill: 0
        };
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-headline font-bold text-on-surface">تنبيهات</h2>
      <div className="space-y-3">
        {mockAlerts.map((alert) => {
          const styles = getAlertStyles(alert.type);
          return (
            <div key={alert.id} className={`${styles.bg} p-5 rounded-2xl flex items-center justify-between`}>
              <div className="flex flex-col">
                <p className={`font-headline font-bold ${styles.title}`}>{alert.title}</p>
                <p className={`text-sm font-medium ${styles.desc}`}>{alert.description}</p>
              </div>
              <span 
                className={`material-symbols-outlined ${styles.icon} text-3xl shrink-0`}
                style={{ fontVariationSettings: `'FILL' ${styles.iconFill}` }}
              >
                {alert.icon}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
