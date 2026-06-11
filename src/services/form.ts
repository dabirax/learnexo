import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import Input from "../components/ui/form/Input";
import Select from "../components/ui/form/Select";
import Check from "../components/ui/form/Check";
import MainButton from "../components/ui/MainButton";

const { fieldContext, formContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
    Select,
    Check,
  },
  formComponents: {
    MainButton,
  },
  fieldContext,
  formContext,
});
