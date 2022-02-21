import { NOTE_1, NOTE_2 } from "./notes"

test('expect first note to have id of n1', () => {
  expect(NOTE_1.id).toBe('n1')
})

test('expect second note to have id of n2', () => {
  expect(NOTE_2.id).toBe('n2')
})