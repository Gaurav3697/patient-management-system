/* eslint-disable  @typescript-eslint/no-explicit-any */

import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from './input'
import { Control } from "react-hook-form";
import { FormFieldType } from '../forms/PatientForm';
import Image from 'next/image';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from "libphonenumber-js/core"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from './select';
import { Textarea } from './textarea';
import { Checkbox } from './checkbox';

interface CustomProps {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    renderSkeleton?: (field: any) => React.ReactNode,
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const Renderfield = ({ field, props }: { field: any; props: CustomProps }) => {
    const { fieldType, iconSrc, iconAlt, placeholder, showTimeSelect, dateFormat, renderSkeleton } = props;


    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md border">
                    {iconSrc && (
                        <Image
                            src={iconSrc}
                            height={24}
                            width={24}
                            alt={iconAlt || 'icon'}
                            className="ml-2"
                        />
                    )}
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className='shad-input border-0'
                        />
                    </FormControl>
                </div>
            )

        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        {...field}
                        className='shad-textArea'
                        disabled={props.disabled}
                    />
                </FormControl>
            )

        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        defaultCountry='US'
                        placeholder={placeholder}
                        international
                        withCountryCallingCode
                        value={field.value as E164Number | undefined}
                        onChange={field.onChange}
                        className='input-phone shad-input border-0'
                    />
                </FormControl>
            )

        case FormFieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image
                        src="/assets/icons/calendar.svg"
                        height={24}
                        width={24}
                        alt='calender'
                        className='ml-2'
                    />
                    <FormControl>
                        <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect={showTimeSelect ?? false}
                            dateFormat={dateFormat ?? 'MM/dd/yyyy'}
                            timeInputLabel='Time:'
                            wrapperClassName='date-picker'
                        />
                    </FormControl>

                </div>
            )

        case FormFieldType.SKELETON:
            return (
                renderSkeleton ? renderSkeleton(field) : null
            )

        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={props.placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shad-select-content">
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            );

        case FormFieldType.CHECKBOX:
            return(
                <FormControl>
                <div className="flex items-center gap-4">
                    <Checkbox
                        id={props.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    <label htmlFor={props.name}
                    className='checkbox-label'
                    >
                        {props.label}
                    </label>
                </div>
            </FormControl>
            )

        default:
            break;



    }
}

const CustomFormfield = (props: CustomProps) => {
    const { control, fieldType, name, label } = props;
    return (
        <div>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className='flex-1'>
                        {
                            fieldType !== FormFieldType.CHECKBOX && label && (
                                <FormLabel>{label}</FormLabel>
                            )
                        }

                        <Renderfield field={field} props={props} />
                        <FormMessage className='shad-error' />
                    </FormItem>
                )}
            />
        </div>
    )
}

export { CustomFormfield };