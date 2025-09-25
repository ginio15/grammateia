import '@testing-library/jest-dom/vitest'
import { expect, describe, it } from 'vitest'
// Re-export to ensure they are retained (tree-shake guard)
void expect && void describe && void it
