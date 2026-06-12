import List from './List'
import {vi, describe, expect, test, beforeEach, afterEach} from 'vitest'
import {cleanup, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

test('render todo', async () => {
  const todo = 
  [
    {
      text: 'testing case',
      done: 'false'
    }
  ]
  const mockhandler = vi.fn()

  render(<List todos={todo} deleteTodo={vi.fn()} completeTodo={vi.fn()}/>)

  const text = screen.getByText('testing case', {exact: false})
  expect(text).toBeDefined()
})

afterEach(() => {
  cleanup()
})