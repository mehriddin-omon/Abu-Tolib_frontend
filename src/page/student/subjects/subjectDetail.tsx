import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components";
import { DialogCloseButton } from "./components/dialogModal";

export const SubjectDetail = () => {
    const location = useLocation();
    const data = location.state;
    return (
        <>
            <Card className="mt-20 w-full h-full">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>
                        {data?.name} fanidan test topshiriqlari
                    </CardTitle>

                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-none">
                                <TableHead className="w-[35%] ">Mavzular</TableHead>
                                <TableHead className="w-[15%] text-center">Testlar soni </TableHead>
                                <TableHead className="w-[5%] text-center">Darajasi</TableHead>
                                <TableHead className="w-[10%] text-center">Holati</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.topics.map((topic: any) => (
                                <TableRow key={topic.id}>
                                    <TableCell className="font-medium">{topic.title}</TableCell>
                                    <TableCell className="text-center">
                                        {!topic.count
                                            ? <h1>Noma'lum</h1>
                                            : topic.count
                                        }</TableCell>
                                    <TableCell className="text-center">{}</TableCell>
                                    <TableCell className="w-[10%]">
                                        <DialogCloseButton topic={topic} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>

            </Card>

        </>
    )
}