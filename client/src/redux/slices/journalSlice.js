import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import journalService from '../../services/journalService';

export const createJournalEntry = createAsyncThunk(
  'journal/create',
  async (entryData, { rejectWithValue }) => {
    try {
      const response = await journalService.createEntry(entryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getJournalEntries = createAsyncThunk(
  'journal/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await journalService.getEntries(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateJournalEntry = createAsyncThunk(
  'journal/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await journalService.updateEntry(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteJournalEntry = createAsyncThunk(
  'journal/delete',
  async (id, { rejectWithValue }) => {
    try {
      await journalService.deleteEntry(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const journalSlice = createSlice({
  name: 'journal',
  initialState: {
    entries: [],
    currentEntry: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentEntry: (state, action) => {
      state.currentEntry = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.unshift(action.payload);
      })
      .addCase(createJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getJournalEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJournalEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(getJournalEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateJournalEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter(e => e._id !== action.payload);
      });
  },
});

export const { clearError, setCurrentEntry } = journalSlice.actions;
export default journalSlice.reducer;
