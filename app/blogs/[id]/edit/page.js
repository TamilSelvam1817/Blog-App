
import { Suspense } from "react";
import EditBlogForm from "@/components/EditBlogForm";

async function EditBlogContent({ params }) {
  const { id } = await params;

  return <EditBlogForm id={id} />;
}

export default function EditBlogPage({ params }) {
  return (
    <Suspense fallback={<p className="p-8">Loading edit page...</p>}>
      <EditBlogContent params={params} />
    </Suspense>
  );
}
