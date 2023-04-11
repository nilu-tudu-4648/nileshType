import React from 'react'
import { Searchbar } from 'react-native-paper'
import { i18n } from './/../../language'
import tw from '@/lib/tailwind';


interface TextInputProps {
    onChangeSearch(text: string): void;
    searchQuery: string;
}
const AppSearchBar: React.FC<TextInputProps> = ({
    searchQuery,
    onChangeSearch,
}) => {
    return (
        <Searchbar
            placeholder={i18n.t("Search")}
            onChangeText={onChangeSearch}
            value={searchQuery}
            inputStyle={{ fontSize: 12 }}
            style={tw`w-9.4/10 my-1.5 self-center bg-white`}
        />
    )
}

export default AppSearchBar