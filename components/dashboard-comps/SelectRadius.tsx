import * as React from "react"

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

export function SelectRadius({ onSelect }: { onSelect: (value: string) => any }) {
	return (
		<Select onValueChange={(value) => onSelect(value)}>
			<SelectTrigger className="w-[180px] text-white placeholder:text-white">
				<SelectValue placeholder="Select Radius For Rooms" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel className="text-white">Select Radius For Rooms</SelectLabel>
					<SelectItem className="text-white" value="5">5KM</SelectItem>
					<SelectItem className="text-white" value="10">10KM</SelectItem>
					<SelectItem className="text-white" value="20">20KM</SelectItem>
					<SelectItem className="text-white" value="30">30KM</SelectItem>
					<SelectItem className="text-white" value="50">50KM</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
