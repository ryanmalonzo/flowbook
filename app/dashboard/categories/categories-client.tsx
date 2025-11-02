"use client";

import { DynamicIcon } from "lucide-react/dynamic";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
}

interface CategoriesClientProps {
  categories: Category[];
}

export default function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-6">
      {categories.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="pt-12 pb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <DynamicIcon
                name="tag"
                className="h-8 w-8 text-muted-foreground"
              />
            </div>
            <CardTitle className="text-2xl">
              {t("categories.empty.title")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("categories.empty.description")}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => {
            const iconName = category.icon || "tag";
            const color = category.color || "#6b7280";

            return (
              <Card
                key={category.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-lg p-2"
                      style={{
                        backgroundColor: `${color}20`,
                      }}
                    >
                      <DynamicIcon
                        name={iconName}
                        size={20}
                        style={{ color }}
                      />
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
