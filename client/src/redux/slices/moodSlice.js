import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import moodService from '../../services/moodService';

export const createMoodRecord = createAsyncThunk(
  'mood/create',
  async (moodData, { rejectWithValue }) => {
    try {
      const response = await moodService.createMood(moodData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getMoodRecords = createAsyncThunk(
  'mood/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await moodService.getMoodRecords(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getMoodStats = createAsyncThunk(
  'mood/getStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await moodService.getMoodStats(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    records: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMoodRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMoodRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records.unshift(action.payload);
      })
      .addCase(createMoodRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMoodRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMoodRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(getMoodRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMoodStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearError } = moodSlice.actions;
export default moodSlice.reducer;
