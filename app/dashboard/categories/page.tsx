import { getRequiredUser } from "@/lib/auth/utils";
import CategoriesClient from "./categories-client";
import { getUserCategories } from "./queries";

export default async function CategoriesPage() {
  const user = await getRequiredUser();

  const categories = await getUserCategories(user.id);

  return <CategoriesClient categories={categories} />;
}
