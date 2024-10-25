import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

test("タブをクリックするとペインが表示される", async () => {
  const user = userEvent.setup();

  render(<App />);

  const tabs = screen.getAllByRole('tab');
  const tabpanels = screen.getAllByRole('tabpanel');

  // タブの数は5個
  expect(tabs.length).toBe(5);
  expect(tabpanels.length).toBe(5);

  // 初期タブは0番
  expect(screen.getByRole('tab', { selected: true })).toBe(tabs[0]);
  expect(tabs[0]).toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');
  expect(tabs[2]).not.toHaveClass('active');
  expect(tabs[3]).not.toHaveClass('active');
  expect(tabs[4]).not.toHaveClass('active');

  // 次のアサーションは成功するが、ほぼ意味がない。
  expect(tabpanels[0]).toBeVisible();
  // なぜなら、次のアサーションも成功してしまうからだ。
  expect(tabpanels[1]).toBeVisible();
  expect(tabpanels[2]).toBeVisible();
  expect(tabpanels[3]).toBeVisible();
  expect(tabpanels[4]).toBeVisible();
  // Bootstrap を使用しているおかげか、可視性はスタイルで直接的にではなく、
  // CSS の active クラスで間接的に制御されているようだ。
  // したがって、toBeVisible のアサーションは上のものにとどめ、以降は行わない。

  // click の戻り値は Promise でなく void なので await は不要。以下同様。
  await user.click(tabs[1]);
  expect(screen.getByRole('tab', { selected: true })).toBe(tabs[1]);
  expect(tabs[0]).not.toHaveClass('active');
  expect(tabs[1]).toHaveClass('active');
  expect(tabs[2]).not.toHaveClass('active');
  expect(tabs[3]).not.toHaveClass('active');
  expect(tabs[4]).not.toHaveClass('active');

  await user.click(tabs[2]);
  expect(screen.getByRole('tab', { selected: true })).toBe(tabs[2]);
  expect(tabs[0]).not.toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');
  expect(tabs[2]).toHaveClass('active');
  expect(tabs[3]).not.toHaveClass('active');
  expect(tabs[4]).not.toHaveClass('active');

  await user.click(tabs[3]);
  expect(screen.getByRole('tab', { selected: true })).toBe(tabs[3]);
  expect(tabs[0]).not.toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');
  expect(tabs[2]).not.toHaveClass('active');
  expect(tabs[3]).toHaveClass('active');
  expect(tabs[4]).not.toHaveClass('active');

  await user.click(tabs[4]);
  expect(screen.getByRole('tab', { selected: true })).toBe(tabs[4]);
  expect(tabs[0]).not.toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');
  expect(tabs[2]).not.toHaveClass('active');
  expect(tabs[3]).not.toHaveClass('active');
  expect(tabs[4]).toHaveClass('active');
});
