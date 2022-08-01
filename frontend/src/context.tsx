import React, { useContext, createContext, useState } from 'react';

interface IProfileData {
  username: string;
  desc: string;
  city: string;
  from: string;
  relationship: number;
}

interface IProfileInfoContext {
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  profileData: IProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<IProfileData>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const ProfileInfoContext = createContext<IProfileInfoContext>(
  {} as IProfileInfoContext
);

interface ProfileInfoContextProviderProps {
  children: React.ReactNode;
}

export const ProfileInfoContextProvider: React.FC<
  ProfileInfoContextProviderProps
> = ({ children }) => {
  const [refetch, setRefetch] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [profileData, setProfileData] = useState<IProfileData>({
    username: '',
    desc: '',
    city: '',
    from: '',
    relationship: 1,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <ProfileInfoContext.Provider
      value={{
        refetch,
        setRefetch,
        isEdit,
        setIsEdit,
        profileData,
        setProfileData,
        handleChange,
      }}
    >
      {children}
    </ProfileInfoContext.Provider>
  );
};

export const useProfileInfoContext = () => useContext(ProfileInfoContext);
