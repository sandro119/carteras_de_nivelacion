import { create } from 'zustand'
import { getProjects } from '../lib/actions/project'


interface IProjectState {
    projects?: any;
    isLoading?: boolean;
    getList: () => Promise<void>;
    deleted?: any;
}

export const useProjectStore = create<IProjectState>()((set) => ({
    user: { data: undefined },
    getList: async () => {
        try {
            set(() => ({ isLoading: true }));
            const fetchData = await getProjects();
            set(() => ({
                isLoading: false,
                projects: fetchData,
            }));
        } catch (err) {
            set(() => ({ isLoading: false }));      
        }
    }
}));