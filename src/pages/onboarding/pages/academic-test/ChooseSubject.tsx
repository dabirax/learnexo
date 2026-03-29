// import React from 'react'
import HeaderText from "../../components/HeaderText";
import Select from "../../../../components/ui/form/Select";
import { subjectsOptions } from "../../service";
import MainButton from "../../../../components/ui/MainButton";
import { useNavigate } from "react-router-dom";

const ChooseSubject = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <HeaderText
        title="Academic test"
        description="Choose a subject to be tested in"
      ></HeaderText>
      <Select
        name="subjects"
        placeholder="Choose subjects"
        options={subjectsOptions}
      ></Select>
      <MainButton onClick={() => navigate(`../questionnairetest/1`)}>
        Proceed to Questions
      </MainButton>
    </div>
  );
};

export default ChooseSubject;
