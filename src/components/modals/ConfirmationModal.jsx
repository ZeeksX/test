import React from "react";
import { DialogHeader, OutsideDismissDialog } from "../ui/Dialog";
import { DropdownMenuSeparator } from "../ui/Dropdown";
import { CardDescription } from "../ui/Card";
import { DialogContent } from "@mui/material";
import CustomButton from "../ui/Button";

const ConfirmationModal = ({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  return (
    <OutsideDismissDialog isOpen={true}>
      <DialogHeader>{title}</DialogHeader>
      <DropdownMenuSeparator />
      <DialogContent>
        <CardDescription>
          <p className="my-3">{message}</p>
        </CardDescription>
        <div className="w-full flex gap-4 px-5">
          <CustomButton
            variant="clear"
            className="gap-2 mt-4 flex-1"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </CustomButton>
          <CustomButton
            onClick={onConfirm}
            loading={isLoading}
            variant="danger"
            className="gap-2 mt-4 flex-1"
          >
            {confirmText}
          </CustomButton>
        </div>
      </DialogContent>
    </OutsideDismissDialog>
  );
};

export default ConfirmationModal;
