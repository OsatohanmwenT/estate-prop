import { DocumentsManager } from "~/components/documents/DocumentsManager";
import MaxContainer from "~/components/shared/MaxContainer";

export default function DocumentsPage() {
  return (
    <MaxContainer className="!p-0">
      <DocumentsManager />
    </MaxContainer>
  );
}
