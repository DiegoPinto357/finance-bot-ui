import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MONTHS } from '@/lib/constants';

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

export const selectFormFieldOption = async (
  fieldName: string,
  value: string
) => {
  const field = screen
    .getByRole('combobox', {
      name: fieldName,
    })
    .closest('div')
    ?.querySelector('select');

  if (field) {
    await userEvent.selectOptions(field, value);
  }
};

type Month = (typeof MONTHS)[number];

export const selectMonth = async (fieldName: string, month: Month) => {
  const fieldContainer = screen.getByText(fieldName).closest('div');
  const fieldButton = within(fieldContainer as HTMLElement).getByRole('button');
  await userEvent.click(fieldButton);
  const monthToSelect = screen.getByText(month);
  await userEvent.click(monthToSelect);
};
