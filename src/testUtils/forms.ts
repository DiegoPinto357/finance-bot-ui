import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const fillFormField = async (
  fieldName: string,
  value: string | number
) => {
  let fieldRole;
  let fieldValue;

  if (typeof value === 'number') {
    fieldRole = 'spinbutton';
    fieldValue = value.toString();
  } else {
    fieldRole = 'textbox';
    fieldValue = value;
  }

  const field = screen.getByRole(fieldRole, {
    name: fieldName,
  });
  await userEvent.clear(field);
  await userEvent.type(field, fieldValue);
};
