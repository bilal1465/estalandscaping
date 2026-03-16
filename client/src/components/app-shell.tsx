import CustomCursor from "@/components/custom-cursor";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
