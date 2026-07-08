import type { DemoAuthProfile, DemoRole } from "../api/types";

type RoleSwitcherProps = {
  profiles: Record<DemoRole, DemoAuthProfile>;
  value: DemoRole;
  onChange: (role: DemoRole) => void;
};

export function RoleSwitcher(props: RoleSwitcherProps) {
  return (
    <div className="role-switcher" aria-label="Demo role switcher">
      {(
        Object.keys(props.profiles) as DemoRole[]
      ).map((role) => (
        <button
          key={role}
          type="button"
          className={role === props.value ? "role-chip is-active" : "role-chip"}
          onClick={() => props.onChange(role)}
        >
          {props.profiles[role].label}
        </button>
      ))}
    </div>
  );
}
