import { useEffect, useRef, useState } from "react";
import { GoChevronDown } from 'react-icons/go';
import Panel from "../panel";

export type DropdownItem = {
    label: string;
    value: string;
}

type Props = {
    options: DropdownItem[],
    value: DropdownItem | null,
    onChange: (option: DropdownItem) => void,
}

const Dropdown = ({ options, value, onChange }: Props) => {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            if(!dropdownRef.current?.contains(event.target as any)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('click', handleDocumentClick, true);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, []);

    const handleClick = () => {
        setIsOpen(isOpen => !isOpen);
    }

    const handleOptionClick = (item: DropdownItem) => {
        setIsOpen(false);
        onChange(item);
    }

    const renderedOptions = options.map((option) => {
        const { label, value } = option;
        return (
            <div className="hover:bg-sky-100 rounded cursor-pointer p-1" key={value} onClick={() => handleOptionClick(option)}>{label}</div>
        );
    });

    return (
        <div className="w-48 relative" ref={dropdownRef}>
            <Panel
                className="flex justify-between items-center cursor-pointer "
                onClick={handleClick}>
                {value?.label ?? 'Select...'} <GoChevronDown className="text-lg" />
            </Panel>
            {isOpen && (
                <Panel className="absolute top-full">
                    {renderedOptions}
                </Panel>
            )
            }
        </div>
    );
}

export default Dropdown;