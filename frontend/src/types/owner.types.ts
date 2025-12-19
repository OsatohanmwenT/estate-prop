export interface CreateOwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (ownerId: string) => void;
}

export interface CreateOwnerFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export const INITIAL_OWNER_FORM_DATA: CreateOwnerFormData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
};
