import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ControllerFieldState,
  ControllerRenderProps,
  Path,
} from "react-hook-form";
import { ROLE_ARRAY_TYPE } from "~/types";

interface RoleDropdownProps {
  field: ControllerRenderProps<any, Path<any>>;
  fieldState: ControllerFieldState;
  roles: ROLE_ARRAY_TYPE;
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({
  field,
  fieldState,
  roles,
}) => {
  return (
    <Select
      aria-invalid={fieldState.invalid}
      {...field}
      onValueChange={field.onChange}
      defaultValue={field.value}
    >
      <SelectTrigger className="w-[180px] shadow-none h-auto rounded-sm">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent className="font-mono">
        {roles.map((role) => (
          <SelectItem key={role} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RoleDropdown;
