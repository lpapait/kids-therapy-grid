import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ViewMode, TherapistFilters, QuickScheduleRequest } from '../types/therapist-agenda.types';

interface TherapistAgendaState {
  selectedWeek: Date;
  viewMode: ViewMode;
  filters: TherapistFilters;
  selectedTherapists: string[];
  isLoading: boolean;
  error: string | null;
  quickScheduleModal: {
    isOpen: boolean;
    therapistId?: string;
    request?: Partial<QuickScheduleRequest>;
  };
  agendaPreview: {
    isOpen: boolean;
    therapistId?: string;
  };
  therapistAgendaModal: {
    isOpen: boolean;
    therapistId?: string;
    selectedWeek: Date;
  };
  calendar: {
    selectedDate: Date;
    selectedDay?: Date;
    showDayView: boolean;
    calendarFilters: {
      therapistIds: string[];
      activityTypes: string[];
      statusFilter: string[];
    };
  };
}

type TherapistAgendaAction =
  | { type: 'SET_SELECTED_WEEK'; payload: Date }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'UPDATE_FILTERS'; payload: Partial<TherapistFilters> }
  | { type: 'SET_SELECTED_THERAPISTS'; payload: string[] }
  | { type: 'TOGGLE_THERAPIST_SELECTION'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'OPEN_QUICK_SCHEDULE'; payload: { therapistId: string; request?: Partial<QuickScheduleRequest> } }
  | { type: 'CLOSE_QUICK_SCHEDULE' }
  | { type: 'OPEN_AGENDA_PREVIEW'; payload: string }
  | { type: 'CLOSE_AGENDA_PREVIEW' }
  | { type: 'OPEN_THERAPIST_AGENDA'; payload: { therapistId: string; selectedWeek?: Date } }
  | { type: 'CLOSE_THERAPIST_AGENDA' }
  | { type: 'SET_THERAPIST_AGENDA_WEEK'; payload: Date }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_CALENDAR_DATE'; payload: Date }
  | { type: 'SET_SELECTED_DAY'; payload: Date | undefined }
  | { type: 'TOGGLE_DAY_VIEW'; payload: boolean }
  | { type: 'UPDATE_CALENDAR_FILTERS'; payload: Partial<TherapistAgendaState['calendar']['calendarFilters']> };

const initialState: TherapistAgendaState = {
  selectedWeek: new Date(),
  viewMode: 'grid',
  filters: {
    searchQuery: '',
    specialties: [],
    statusFilter: [],
    availabilityFilter: 'all'
  },
  selectedTherapists: [],
  isLoading: false,
  error: null,
  quickScheduleModal: {
    isOpen: false
  },
  agendaPreview: {
    isOpen: false
  },
  therapistAgendaModal: {
    isOpen: false,
    selectedWeek: new Date()
  },
  calendar: {
    selectedDate: new Date(),
    selectedDay: undefined,
    showDayView: false,
    calendarFilters: {
      therapistIds: [],
      activityTypes: [],
      statusFilter: []
    }
  }
};

function therapistAgendaReducer(state: TherapistAgendaState, action: TherapistAgendaAction): TherapistAgendaState {
  switch (action.type) {
    case 'SET_SELECTED_WEEK':
      return { ...state, selectedWeek: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'UPDATE_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload }
      };
    case 'SET_SELECTED_THERAPISTS':
      return { ...state, selectedTherapists: action.payload };
    case 'TOGGLE_THERAPIST_SELECTION':
      return {
        ...state,
        selectedTherapists: state.selectedTherapists.includes(action.payload)
          ? state.selectedTherapists.filter(id => id !== action.payload)
          : [...state.selectedTherapists, action.payload]
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'OPEN_QUICK_SCHEDULE':
      return {
        ...state,
        quickScheduleModal: {
          isOpen: true,
          therapistId: action.payload.therapistId,
          request: action.payload.request
        }
      };
    case 'CLOSE_QUICK_SCHEDULE':
      return {
        ...state,
        quickScheduleModal: { isOpen: false }
      };
    case 'OPEN_AGENDA_PREVIEW':
      return {
        ...state,
        agendaPreview: {
          isOpen: true,
          therapistId: action.payload
        }
      };
    case 'CLOSE_AGENDA_PREVIEW':
      return {
        ...state,
        agendaPreview: { isOpen: false }
      };
    case 'OPEN_THERAPIST_AGENDA':
      return {
        ...state,
        therapistAgendaModal: {
          isOpen: true,
          therapistId: action.payload.therapistId,
          selectedWeek: action.payload.selectedWeek || state.selectedWeek
        }
      };
    case 'CLOSE_THERAPIST_AGENDA':
      return {
        ...state,
        therapistAgendaModal: {
          ...state.therapistAgendaModal,
          isOpen: false
        }
      };
    case 'SET_THERAPIST_AGENDA_WEEK':
      return {
        ...state,
        therapistAgendaModal: {
          ...state.therapistAgendaModal,
          selectedWeek: action.payload
        }
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
        selectedTherapists: []
      };
    case 'SET_CALENDAR_DATE':
      return {
        ...state,
        calendar: {
          ...state.calendar,
          selectedDate: action.payload
        }
      };
    case 'SET_SELECTED_DAY':
      return {
        ...state,
        calendar: {
          ...state.calendar,
          selectedDay: action.payload,
          showDayView: !!action.payload
        }
      };
    case 'TOGGLE_DAY_VIEW':
      return {
        ...state,
        calendar: {
          ...state.calendar,
          showDayView: action.payload
        }
      };
    case 'UPDATE_CALENDAR_FILTERS':
      return {
        ...state,
        calendar: {
          ...state.calendar,
          calendarFilters: {
            ...state.calendar.calendarFilters,
            ...action.payload
          }
        }
      };
    default:
      return state;
  }
}

interface TherapistAgendaContextType {
  state: TherapistAgendaState;
  dispatch: React.Dispatch<TherapistAgendaAction>;
}

const TherapistAgendaContext = createContext<TherapistAgendaContextType | undefined>(undefined);

export const TherapistAgendaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(therapistAgendaReducer, initialState);

  return (
    <TherapistAgendaContext.Provider value={{ state, dispatch }}>
      {children}
    </TherapistAgendaContext.Provider>
  );
};

export const useTherapistAgendaContext = () => {
  const context = useContext(TherapistAgendaContext);
  if (context === undefined) {
    throw new Error('useTherapistAgendaContext must be used within a TherapistAgendaProvider');
  }
  return context;
};
