import { Button, PageHeader } from "@anyglade/kit";
import { useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.className = theme;
  document.documentElement.dataset.theme = theme;
}

export function App() {
  const [theme, setTheme] = useState<Theme>("light");

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 p-6">
      <PageHeader
        title="@anyglade/kit"
        description="Components and theme rendered from the package source."
        actions={
          <Button variant="secondary" onPress={toggleTheme}>
            {theme === "light" ? "Dark theme" : "Light theme"}
          </Button>
        }
      />
      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button isDisabled>Disabled</Button>
      </div>
    </main>
  );
}
