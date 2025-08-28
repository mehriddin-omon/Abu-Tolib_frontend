import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PlusCircle, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

type TestType = {
  question: string
  variants: string[]
  correctAnswerIndex: number | null
}

export const CreateTest = () => {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [tests, setTests] = useState<TestType[]>([])

  const addTest = () => {
    setTests([
      ...tests,
      {
        question: "",
        variants: ["", "", "", ""],
        correctAnswerIndex: null,
      },
    ])
  }

  const updateTest = (
    testIndex: number,
    type: "question" | "variant" | "answer",
    value: string | number,
    variantIndex?: number
  ) => {
    const updatedTests = [...tests]
    if (type === "question") {
      updatedTests[testIndex].question = value as string
    } else if (type === "variant" && variantIndex !== undefined) {
      updatedTests[testIndex].variants[variantIndex] = value as string
    } else if (type === "answer") {
      updatedTests[testIndex].correctAnswerIndex = Number(value)
    }
    setTests(updatedTests)
  }

  const removeTest = (index: number) => {
    setTests(tests.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    const payload = {
      subject,
      title,
      tests,
    }
    console.log('payload', payload);
  }
  return (
    <div className="">
      <Card className="h-full flex flex-col rounded-4 my-1">
        <ScrollArea className="h-170 w-full rounded-md border">
          <div className="border-b p-6">
            <CardHeader className="p-0 ">
              <CardTitle className="text-2xl mb-4">Test yaratish</CardTitle>
              <div className="flex justify-between">
                <div>
                  <Label className="text-base mb-1 block">Fanning nomi</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Masalan: Algebra"
                  />
                </div>
                <div>
                  <Label className="text-base mb-1 block">Mavzu nomi</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Algebra"
                  />
                </div>
              </div>
            </CardHeader>
          </div>
          <div className="p-4">
            {tests.map((test, testIndex) => (
              <div key={testIndex} className="bg-white shadow-md border p-4">
                <div className="flex justify-between items-start">
                  <Label className="text-lg font-semibold">
                    Savol {testIndex + 1}
                  </Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTest(testIndex)}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </div>

                <Textarea
                  placeholder="Savol matni"
                  value={test.question}
                  onChange={(e) =>
                    updateTest(testIndex, "question", e.target.value)
                  }
                  className="mt-2"
                />

                <RadioGroup
                  value={test.correctAnswerIndex?.toString() || ""}
                  onValueChange={(val) => updateTest(testIndex, "answer", val)}
                >
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {test.variants.map((opt, optIndex) => (
                      <div
                        key={optIndex}
                        className="flex items-center gap-3 border rounded-lg p-2"
                      >
                        <RadioGroupItem
                          value={optIndex.toString()}
                          id={`answer-${testIndex}-${optIndex}`}
                        />
                        <Input
                          value={opt}
                          onChange={(e) =>
                            updateTest(testIndex, "variant", e.target.value, optIndex)
                          }
                          placeholder={`Variant ${String.fromCharCode(65 + optIndex)}`}
                        />
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex justify-between items-center border-t p-6">
          <Button
            onClick={addTest}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Yangi test qo'shish
          </Button>

          <Button
            onClick={handleSubmit}
          // className="bg-green-600 hover:bg-green-700 text-white"
          >
            Saqlash
          </Button>
        </div>
      </Card>
    </div>
  )
}
