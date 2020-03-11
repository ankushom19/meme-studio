import { Model, DataTypes } from 'sequelize'
import { database } from '../config/database'

export const fontsFamily = [
  'Arial',
  'Helvetica',
  'Impact',
  'Geneva',
  'Arial Black',
  'Times New Roman',
  'Courier New',
  'Lucida Console'
]

export class TextBox extends Model {
  public id: number
  public value: string
  public height: number
  public width: number
  public fontSize: number
  public fontFamily: string
  public boxShadow: number
  public color: string
  public centerY: number
  public centerX: number
  public textAlign: string
  public alignVertical: string
  public isUppercase: boolean
  public readonly createdAt: Date
  public readonly updatedAt: Date
  static associate: (models: object) => void
}

TextBox.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    value: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      defaultValue: ''
    },
    width: {
      type: new DataTypes.NUMBER(),
      allowNull: false
    },
    height: {
      type: new DataTypes.NUMBER(),
      allowNull: false
    },
    centerX: {
      type: new DataTypes.NUMBER(),
      allowNull: false,
      validate: {
        customValidator(value: number): void {
          if (value > this.width) {
            throw new Error("centerX can't be greater than the width")
          }
        }
      }
    },
    centerY: {
      type: new DataTypes.NUMBER(),
      allowNull: false,
      validate: {
        customValidator(value: number): void {
          if (value > this.height) {
            throw new Error("centerX can't be greater than the width")
          }
        }
      }
    },
    rotate: {
      type: new DataTypes.NUMBER(),
      allowNull: false,
      defaultValue: 0,
      validate: {
        len: [0, 360]
      }
    },
    fontSize: {
      type: new DataTypes.NUMBER(),
      allowNull: false
    },
    fontFamily: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isIn: [fontsFamily]
      }
    },
    boxShadow: {
      type: new DataTypes.NUMBER(),
      allowNull: false
    },
    color: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        is: /^(#[a-f0-9]{6}|black|green|silver|gray|olive|white|yellow|maroon|navy|red|blue|purple|teal|fuchsia|aqua)$/i
      }
    },
    alignVertical: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isIn: [['top', 'middle', 'bottom']]
      }
    },
    textAlign: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isIn: [['left', 'center', 'right']]
      }
    },
    isUppercase: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'textbox',
    sequelize: database
  }
)

export default TextBox